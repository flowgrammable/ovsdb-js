exports.listBridges = function(){
   return  { 
              Port: { 
                columns: ['interfaces', 'name', 'tag', 'trunks']
              },
              Manager: {
                columns: ['is_connected','target']
              },
              Interface: {
                columns: ['name','options','type']
              },
              Bridge: {
                columns: ['controller','fail_mode','name','ports']
              },
              Controller: {
                columns: ['is_connected','target']
              },
              Open_vSwitch: {
                columns: ['bridges','cur_cfg','manager_options','ovs_version']
              }
   };
};
