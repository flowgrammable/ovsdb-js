Setting up OVS
---------------

1. Clone the git repo
``` git clone http://github.com/flowgrammable/ovsdb-js ```

2. Change directory to ovsdb-js
``` cd ovsdb-js ```

3. Launch the Vagrant environment
``` vagrant up ```

4. SSH into the Vagrant environment
``` vagrant ssh ```

5. Install npm dependencies
`` cd /vagrant && npm install ```

6. Tell openvswitch to listen on port
``` sudo ovs-vsctl set-manager ptcp:6640 ```

Unit Tests
----------
```grunt```
