package com.cloudelves.forecast.gateway.constants;

public class Constants {

    public static String TOKEN_HEADER = "id_token";
    public static String USERNAME_HEADER = "name";
    public static String EMAIL_HEADER = "email";

    public static String SOURCE_GATEWAY = "gateway";
    public static String DATA_CONTENT_TYPE = "application/json";

    public static String COMPONENT_INGESTOR = "ingestor";

    // event types
    public static String INGESTOR_GET_DATA = "elves.ingestor.getdata";
    public static String REGISTRY_APPLOG = "elves.registry.applog";

    public static final int STATUS_CREATED = 0;
    public static final int STATUS_SUCCESS = 1;
    public static final int STATUS_FAILED = 2;
    public static final int STATUS_ERROR = -1;

    public static final String EVENT_GET_USER = "get_user";
    public static final String EVENT_ADD_USER = "add_user";
    public static final String EVENT_GET_DATA_NEXRAD = "get_data_nexrad";
    public static final String EVENT_GET_DATA_MERA = "get_data_mera";
    public static final String EVENT_GET_EVENTS = "get_events";
    public static final String EVENT_GET_HISTORY = "get_history";

}
