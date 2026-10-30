package com.mobile.core.backend.service;

import com.mobile.core.backend.dto.WorkoutTagDTO;
import com.mobile.core.backend.mapper.WorkoutTagMapper;
import com.mobile.core.backend.model.WorkoutTag;
import com.mobile.core.backend.repository.WorkoutTagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkoutTagService {
    private final WorkoutTagRepository repository;
    private final WorkoutTagMapper mapper;

    @Transactional(readOnly = true)
    public List<WorkoutTagDTO> getAllTags() {
        return mapper.mapTagsToDto(repository.findAll(Sort.by("name")));
    }

    @Transactional
    public WorkoutTagDTO createTag(WorkoutTagDTO dto) {
        String name = dto.getName().trim();
        if (name.length() > 255) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tag name must not exceed 255 characters");
        }
        WorkoutTag tag = repository.findByName(name).orElseGet(() ->
                repository.save(WorkoutTag.builder().name(name).build()));
        return new WorkoutTagDTO(tag.getId(), tag.getName());
    }
}
