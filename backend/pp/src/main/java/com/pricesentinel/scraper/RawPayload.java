package com.pricesentinel.scraper;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "raw_payload")
public class RawPayload {

    @Id
    private String ref;

    @Column(name = "content", nullable = false, columnDefinition = "jsonb")
    private String content; // stored as JSON string; Jackson serialises before persist

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public RawPayload() {}

    public RawPayload(String ref, String content) {
        this.ref = ref;
        this.content = content;
    }

    public String getRef() { return ref; }
    public void setRef(String ref) { this.ref = ref; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
