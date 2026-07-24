package com.fantatravel.aop;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.time.StopWatch;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    //fix annotation around

    @Around("execution(* com.fantatravel..service..*(..)) || execution(* com.fantatravel..controller..*(..))")
    public Object logServiceMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();

        // Log BEGIN and parameters
        log.debug("[{}.{}] BEGIN - Parameters: {}", className, methodName, Arrays.toString(args));

        Object result;
        StopWatch stopWatch = new StopWatch();
        try {
            stopWatch.start();
            result = joinPoint.proceed(); // Execute the method
        } catch (Exception e) {
            log.error("[{}.{}] ERROR: {}", className, methodName, e.getMessage(), e);
            throw e;
        }

        stopWatch.stop();
        // Log END e risultato
        log.debug("[{}.{}] END - Result: {}, Time: {}ms", className, methodName, result, stopWatch.getTime(TimeUnit.MILLISECONDS));
        return result;
    }
}