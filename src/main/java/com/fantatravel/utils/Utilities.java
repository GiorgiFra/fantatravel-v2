package com.fantatravel.utils;


import org.apache.commons.lang3.StringUtils;

import java.util.Map;
import java.util.stream.Stream;

public class Utilities {

    private Utilities() {
        throw new UnsupportedOperationException("Utility class");
    }

    public static String getCurrentMethodName() {
        return Thread.currentThread().getStackTrace()[2].getMethodName();
    }

    public static String getLoginDisplay(String login) {
        return StringUtils.capitalize(login.toLowerCase());
    }

    public static String titleCase(String string) {
        string = string.toLowerCase();
        return string.replaceFirst(string.substring(0, 1), string.substring(0, 1).toUpperCase());
    }

    public static <K, V> Stream<K> keys(Map<K, V> map, V value) {
        return map
                .entrySet()
                .stream()
                .filter(entry -> value.equals(entry.getValue()))
                .map(Map.Entry::getKey);
    }
}
