package com.pricesentinel.common;

import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;

public interface ClockProvider {
    Clock getClock();
    Instant now();
    ZoneId getZone();

    @Component
    class SystemClockProvider implements ClockProvider {
        private final Clock clock = Clock.systemUTC();

        @Override
        public Clock getClock() {
            return clock;
        }

        @Override
        public Instant now() {
            return Instant.now(clock);
        }

        @Override
        public ZoneId getZone() {
            return clock.getZone();
        }
    }
}
