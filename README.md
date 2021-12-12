## Voice NPO main repo

Primary repo for voice.npo

### Config folder

Everything in this folder is just a symlink to the same file in the parent folder. This way VSCode can ignore all the files in the parent folder and just show them here which makes for a cleaner workspace.

### Launch Dev Environment

1. Clone this repo on your machine
1. Install [Vagrant](https://www.vagrantup.com/downloads)
1. Install one of the following. Parallels or vmware fusion have better performance, VirtualBox is free
   - [Parallels](https://www.parallels.com/) (OSX)
   - [VMWare Fusion](https://www.vmware.com/products/fusion.html)
   - [VirtualBox](https://www.virtualbox.org/)
1. Install the necessary vagrant plugin if you are using parallels or vmware:
   - `vagrant plugin install vagrant-parallels`
   - `vagrant plugin install vagrant-vmware-desktop`
1. If using VMWare or VirtualBox, open `Vagrantfile` and change "parallels" in `config.vm.provider "parallels" do |v|` to "vmware_desktop", or "virtualbox" (any changes to this file are ignored in git)
1. Run `vagrant up` from the project root
1. Wait while the image is downloaded and all of the dependencies are installed

#### VS Code Config

1.  Echo the vagrant config into your local ssh config: `vagrant ssh-config >> ~/.ssh/config` (modify the name if desired)
1.  Install the "Remote - SSH" extension
1.  Select **Remote-SSH: Connect to Host...** from the Command Palette (F1, ⇧⌘P)
1.  Select the newly added host
1.  You must install any extensions that you use on this host. Open the extensions side-panel, scroll through your extensions, and click "Install in SSH" on all applicable extensions

#### Shell Access

1.  ssh into the vm: `vagrant ssh`
1.  run `voice` for a list of available commands, or see src/tools/dev-tools/README.md
    - The two most important command are `voice start` and `voice stop` which start/stop file watchers and kubernetes. If you don't either run `voice stop` or suspend the VM, k8s uses a fair bit of CPU time and kills battery life on laptops
1.  Set the ssh default directory, add this to your ssh config:
    ```sh
    RequestTTY force
    RemoteCommand cd /voice && zsh
    ```
