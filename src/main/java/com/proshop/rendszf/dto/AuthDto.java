package com.proshop.rendszf.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;
import org.codehaus.jackson.map.annotate.JsonSerialize;
import org.codehaus.jackson.map.ext.JodaSerializers.LocalDateTimeSerializer;

@Data
public class AuthDto {
    private long id;

    private String email;

    private String jelszo;
}
