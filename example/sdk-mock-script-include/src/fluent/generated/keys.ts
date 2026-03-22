import "@servicenow/sdk/global";

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                        "IncidentHelper": {
                            "table": "sys_script_include",
                            "id": "226ff4af4864491db8a67fb8fee48c8a"
                        },
                        "package_json": {
                            "table": "sys_module",
                            "id": "d45099bb88524816a8d73394a5ee9aae"
                        }
                    };
            }
        }
    }
}
