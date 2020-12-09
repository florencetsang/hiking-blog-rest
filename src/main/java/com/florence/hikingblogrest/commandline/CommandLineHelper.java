package com.florence.hikingblogrest.commandline;

import org.apache.commons.cli.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

public class CommandLineHelper {

    private static final Logger LOGGER = LogManager.getLogger(CommandLineHelper.class);

    private CommandLineHelper(){}

    public static Map<CommandLineOption, List<String>> parseOptions(String[] args) {

        CommandLineParser parser = new DefaultParser();
        CommandLine line;
        try {
            line = parser.parse(getSupportedOptions(), args);
        } catch (ParseException e) {
            LOGGER.error("ParseException: ", e);
            throw new RuntimeException(e);
        }
        EnumMap<CommandLineOption, List<String>> argMap = new EnumMap<>(CommandLineOption.class);
        for (Option option : line.getOptions()) {
            argMap.put(CommandLineOption.valueOf(option), option.getValuesList());
        }
        return argMap;
    }


    private static Options getSupportedOptions() {
        Options options = new Options();
        for (CommandLineOption option : CommandLineOption.values()) {
            options.addOption(option.getOption());
        }
        return options;
    }

}
