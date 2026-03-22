var IncidentHelper = Class.create();
IncidentHelper.prototype = {
        initialize: function() {

        },

        createIncident: function(incidentData) {
            var incident = new GlideRecord('incident');
            incident.short_description = incidentData.short_description;
            incident.description = incidentData.description;
            incident.caller_id = incidentData.caller_id;
            incident.category = incidentData.category;
            incident.subcategory = incidentData.subcategory;
            incident.priority = incidentData.priority;
            return incident.insert();
        },
     
        type: 'IncidentHelper'
};

if(typeof module !== 'undefined' && module.exports){
    module.exports = IncidentHelper;
}