package com.fantatravel.destination.assembler.mapper;

import com.fantatravel.destination.model.Destination;
import com.fantatravel.destination.representation.DestinationModel;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface DestinationModelMapper {

    DestinationModelMapper INSTANCE = Mappers.getMapper(DestinationModelMapper.class);

     DestinationModel toModel(Destination destination);
}
