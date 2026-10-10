package com.mobile.core.backend.mapper;

import com.mobile.core.backend.dto.WorkoutTagDTO;
import com.mobile.core.backend.model.WorkoutTag;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class WorkoutTagMapper {
    public List<WorkoutTagDTO> mapTagsToDto(List<WorkoutTag> tags) {
        if (tags == null) return Collections.emptyList();
        return tags.stream()
                .map(t -> new WorkoutTagDTO(t.getId(), t.getName()))
                .toList();
    }

    public List<WorkoutTag> mapTagsToEntity(List<WorkoutTagDTO> dtos) {
        if (dtos == null) return Collections.emptyList();
        return dtos.stream().map(d -> {
            WorkoutTag tag = new WorkoutTag();
            tag.setId(d.getId());
            tag.setName(d.getName());
            return tag;
        }).toList();
    }
}
