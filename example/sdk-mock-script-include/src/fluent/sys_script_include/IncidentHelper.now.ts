import { Record } from '@servicenow/sdk/core'

export default Record({
    $id: Now.ID['IncidentHelper'],
    table: 'sys_script_include',
    data: {
        access: 'package_private',
        active: true,
        api_name: 'x_502054_mock_si.IncidentHelper',
        client_callable: false,
        mobile_callable: false,
        name: 'IncidentHelper',
        sandbox_callable: false,
        script: Now.include('../../includes/sys_script_include/IncidentHelper.server.js'),
        sys_customer_update: false,
        sys_name: 'IncidentHelper',
        sys_replace_on_upgrade: false,
    },
})
