# encoding: utf-8
# -*- mode: ruby -*-
# vi: set ft=ruby :
# Box / OS
VAGRANT_BOX = 'bento/ubuntu-20.04'
VM_NAME = 'voice-dev'
VM_USER = 'vagrant'

# # VM Port — uncomment this to use NAT instead of DHCP
# VM_PORT = 8080
Vagrant.configure(2) do |config|

  # allow vm to access github keys
  config.ssh.forward_agent = true

  # Vagrant box from Hashicorp
  config.vm.box = VAGRANT_BOX

  # Actual machine name
  config.vm.hostname = VM_NAME

  # Set VM name in Virtualbox
  config.vm.provider "parallels" do |v|
    v.name = VM_NAME
    v.memory = 4096
    v.cpus = 2
  end

  #DHCP — comment this out if planning on using NAT instead
  #config.vm.network "private_network", type: "dhcp"
  config.vm.network :forwarded_port, guest: 80, host: 80
  config.vm.network :forwarded_port, guest: 443, host: 443

  config.vm.synced_folder '.', '/voice'

  #Install package for your VM
  config.vm.provision "shell", inline: <<-SHELL

    # disable ipv6.  Dunno why but in Parallels it's taking *forever* to do ipv6 lookups
    echo '--ipv4' >> ~/.curlrc
    echo "net.ipv6.conf.all.disable_ipv6=1" | sudo tee -a /etc/sysctl.conf
    echo "net.ipv6.conf.default.disable_ipv6=1" | sudo tee -a /etc/sysctl.conf
    echo "net.ipv6.conf.lo.disable_ipv6=1" | sudo tee -a /etc/sysctl.conf
    echo "Acquire::ForceIPv4 \\\"true\\\";" | sudo tee -a /etc/apt/apt.conf.d/99force-ipv4

    sudo apt-get update -y
    sudo apt-get install -y git curl ca-certificates gnupg lsb-release

    # docker source
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    # node16 source
    curl -fsSL https://deb.nodesource.com/setup_16.x | bash -

    # yarn source
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

    # required to get yarn to install
    sudo apt-get remove cmdtest
    sudo apt-get update -y

    sudo apt-get install -y docker-ce docker-ce-cli containerd.io \
      nodejs yarn zsh unzip

    # install watchman
    curl -OJL curl https://github.com/facebook/watchman/releases/download/v2021.10.18.00/watchman-v2021.10.18.00-linux.zip -o watchman.zip
    unzip watchman.zip
    cd watchman-v2021.10.18.00-linux
    sudo mkdir -p /usr/local/{bin,lib} /usr/local/var/run/watchman
    sudo cp bin/* /usr/local/bin
    sudo cp lib/* /usr/local/lib
    sudo chmod 755 /usr/local/bin/watchman
    sudo chmod 2777 /usr/local/var/run/watchman
    cd ..
    rm -rf watchman*

    # install microk8s
    sudo snap install microk8s --classic

    # install oh my zsh
    yes | sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
    sudo chsh -s /usr/bin/zsh vagrant
    echo PROMPT=%m\\\ \$PROMPT >> .zshrc

    # disable oh my zsh auto updating
    echo "DISABLE_AUTO_UPDATE=\"true\"" | cat - .zshrc > /tmp/out && mv /tmp/out .zshrc

    # disable npm
    echo "echo \"Use \\\"yarn\\\" or \\\"voice\\\".  If there is something you can't do with those npm is at \\\"/usr/bin/npm\\\"\", but please also add a task to update the \\\"voice\\\" command" | sudo tee /usr/local/bin/npm
    sudo chmod +x /usr/local/bin/npm

    # increase inotify limit
    echo "fs.inotify.max_user_instances=8192" | sudo tee -a /etc/sysctl.conf
    echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf
    sudo sysctl -p

    # set up voice repo
    cd /voice
    yarn
  SHELL
end