#!/usr/bin/env sh

## Common
sudo apt-get update -y
sudo apt-get -y install git unzip python-pip python-dev

## Ryu
cd /home/vagrant
sudo git clone http://github.com/osrg/ryu.git
cd /home/vagrant/ryu
sudo python setup.py install
sudo pip install pbr
sudo pip install six --upgrade

# Mininet 
cd /home/vagrant
sudo git clone http://github.com/mininet/mininet.git
cd /home/vagrant/mininet
sudo python setup.py install
sudo /home/vagrant/mininet/util/install.sh -n

# OVS / OpenVSwitch
cd /home/vagrant
/vagrant/util/ovs_install-2.3.1
/vagrant/util/ovs_run-2.3.1

# Node
cd /home/vagrant
/vagrant/util/nodejs_install

# Node modules 
cd /vagrant
npm install
