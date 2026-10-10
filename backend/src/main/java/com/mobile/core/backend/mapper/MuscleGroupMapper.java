package com.mobile.core.backend.mapper;

import com.mobile.core.backend.dto.MuscleGroupDTO;
import com.mobile.core.backend.model.MuscleGroup;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class MuscleGroupMapper {
    public List<MuscleGroupDTO> mapMuscleGroupsToDto(List<MuscleGroup> groups) {
        if (groups == null) return Collections.emptyList();
        return groups.stream()
                .map(m -> new MuscleGroupDTO(m.getId(), m.getName()))
                .toList();
    }

    public List<MuscleGroup> mapMuscleGroupsToEntity(List<MuscleGroupDTO> dtos) {
        if (dtos == null) return Collections.emptyList();
        return dtos.stream().map(d -> {
            MuscleGroup group = new MuscleGroup();
            group.setId(d.getId());
            group.setName(d.getName());
            return group;
        }).toList();
    }
}
