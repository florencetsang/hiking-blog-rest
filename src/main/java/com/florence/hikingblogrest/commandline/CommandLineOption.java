package com.florence.hikingblogrest.commandline;

import org.apache.commons.cli.Option;

public enum CommandLineOption {

    PROFILE_LOCATION("profileLocation", "User profile location override");

    private final Option option;

    CommandLineOption(final String opt, final String description) {
        this.option = new Option(opt, false, description);
    }

    public static CommandLineOption valueOf(Option option) {
        for (CommandLineOption opt : CommandLineOption.values()) {
            if (opt.getOption().equals(option)) {
                return opt;
            }
        }
        return null;
    }

    public Option getOption() {
        return this.option;
    }
}
