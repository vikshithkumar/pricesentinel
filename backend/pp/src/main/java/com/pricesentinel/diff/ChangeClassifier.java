package com.pricesentinel.diff;

import com.pricesentinel.changeevent.ChangeEvent.ChangeEventType;
import org.springframework.stereotype.Component;

/**
 * Pure function mapping a diff field name to a {@link ChangeEventType}.
 * Kept in its own class so the classifier logic can be unit-tested independently
 * and swapped without touching DiffEngine.
 */
@Component
public class ChangeClassifier {

    /**
     * Classify a detected field-level change.
     *
     * @param field the field name that changed ("priceAmount", "usageLimitsJson",
     *              "featuresJson", "planAdded", "planRemoved", "currencyMismatch", etc.)
     * @return the canonical change event type
     */
    public ChangeEventType classify(String field) {
        if (field == null) return ChangeEventType.schema;
        return switch (field) {
            case "priceAmount"                            -> ChangeEventType.price;
            case "usageLimitsJson", "usageLimit"          -> ChangeEventType.usage_limit;
            case "planAdded", "planRemoved"               -> ChangeEventType.plan;
            case "featuresJson", "feature"                -> ChangeEventType.feature;
            case "currencyMismatch", "periodMismatch",
                 "schemaDrift", "schema"                  -> ChangeEventType.schema;
            default                                       -> ChangeEventType.feature;
        };
    }
}
