package com.pricesentinel.changeevent;

import com.pricesentinel.common.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class ChangeEventService {

    private final ChangeEventRepository changeEventRepository;

    public ChangeEventService(ChangeEventRepository changeEventRepository) {
        this.changeEventRepository = changeEventRepository;
    }

    public List<ChangeEvent> listByStatus(ChangeEvent.ChangeEventStatus status) {
        if (status == null) {
            return changeEventRepository.findAllByOrderByFinalScoreDesc();
        }
        return changeEventRepository.findByStatusOrderByFinalScoreDesc(status);
    }

    public ChangeEvent getById(UUID id) {
        return changeEventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ChangeEvent not found: " + id));
    }

    @Transactional
    public ChangeEvent dismiss(UUID id) {
        ChangeEvent event = getById(id);
        event.setStatus(ChangeEvent.ChangeEventStatus.dismissed);
        return changeEventRepository.save(event);
    }
}
