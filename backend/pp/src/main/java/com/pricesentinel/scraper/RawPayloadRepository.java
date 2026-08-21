package com.pricesentinel.scraper;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RawPayloadRepository extends JpaRepository<RawPayload, String> {
}
