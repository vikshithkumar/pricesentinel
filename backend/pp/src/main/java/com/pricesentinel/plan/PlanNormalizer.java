package com.pricesentinel.plan;

import org.springframework.stereotype.Component;

import java.util.Locale;
import java.util.regex.Pattern;

/**
 * Normalises raw plan names extracted from pricing pages into a canonical form
 * used for cross-snapshot matching by the DiffEngine.
 *
 * Rules (applied in order):
 *  1. Lower-case the name.
 *  2. Trim leading/trailing whitespace.
 *  3. Strip common edition suffixes: "plan", "tier", "edition", "package".
 *  4. Collapse internal whitespace to a single space.
 *  5. Strip non-alphanumeric characters except spaces and "+".
 */
@Component
public class PlanNormalizer {

    private static final Pattern SUFFIX_PATTERN =
            Pattern.compile("\\b(plan|tier|edition|package)s?\\b", Pattern.CASE_INSENSITIVE);

    private static final Pattern NON_ALNUM_PATTERN =
            Pattern.compile("[^a-z0-9 +]");

    private static final Pattern WHITESPACE_PATTERN =
            Pattern.compile("\\s+");

    /**
     * Normalises a plan name for stable cross-snapshot matching.
     *
     * @param rawName the original plan name from the pricing page
     * @return a normalised, canonical name
     */
    public String normalizeName(String rawName) {
        if (rawName == null) return "";
        String s = rawName.toLowerCase(Locale.ROOT).trim();
        s = SUFFIX_PATTERN.matcher(s).replaceAll("");
        s = NON_ALNUM_PATTERN.matcher(s).replaceAll("");
        s = WHITESPACE_PATTERN.matcher(s).replaceAll(" ").trim();
        return s;
    }

    /**
     * Normalises a currency code to upper-case (e.g. "usd" → "USD").
     */
    public String normalizeCurrency(String currency) {
        if (currency == null) return null;
        return currency.toUpperCase(Locale.ROOT).trim();
    }

    /**
     * Normalises billing period to one of: monthly | annual | usage | null.
     */
    public String normalizeBillingPeriod(String period) {
        if (period == null) return null;
        String s = period.toLowerCase(Locale.ROOT).trim();
        if (s.contains("month")) return "monthly";
        if (s.contains("year") || s.contains("annual")) return "annual";
        if (s.contains("usage") || s.contains("pay-as")) return "usage";
        return s;
    }
}
