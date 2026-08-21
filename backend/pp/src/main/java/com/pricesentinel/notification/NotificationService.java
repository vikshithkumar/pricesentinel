package com.pricesentinel.notification;

import com.pricesentinel.changeevent.ChangeEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    public void dispatchAlertNotification(ChangeEvent event, String vendorName) {
        log.info("DISPATCHING ALERT NOTIFICATION: Vendor='{}' Type='{}' Score={} Summary='{}'",
                vendorName, event.getType(), event.getFinalScore(), event.getImpactSummary());
        // Slack / Email / Webhook notification hook logic
    }

    public void dispatchScraperFailureNotification(String collectorId, String errorMessage) {
        log.warn("DISPATCHING SCRAPER FAILURE NOTIFICATION: Collector='{}' Error='{}'",
                collectorId, errorMessage);
        // Alert ops channel logic
    }
}
