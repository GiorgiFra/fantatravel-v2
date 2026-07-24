package com.fantatravel.destination.assembler;

import com.fantatravel.destination.assembler.mapper.DestinationModelMapper;
import com.fantatravel.destination.model.Destination;
import com.fantatravel.destination.representation.DestinationModel;
import com.fantatravel.security.assembler.mapper.UserInfoModelMapper;
import com.fantatravel.security.model.CustomUserDetails;
import com.fantatravel.security.representation.UserInfoModel;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class DestinationModelAssembler {

    public DestinationModel toModel(Destination destination) {
        return DestinationModelMapper.INSTANCE.toModel(destination);
    }

    public List<DestinationModel> toModelList(List<Destination> destinations) {
        return destinations.stream()
                .map(this::toModel)
                .collect(Collectors.toList());
    }
}
