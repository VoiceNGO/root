## Voice NPO main repo

Primary repo for voice.npo

### Config folder

Everything in this folder is just a symlink to the same file in the parent folder. This way VSCode can ignore all the files in the parent folder and just show them here which makes for a cleaner workspace.

### Launch Dev Environment

#### OSX Config

Run `./scripts/osx-pre-docker-nfs.sh` to allow an NFS share to docker which is much faster than docker's normal driver

#### Linux Config

TODO: The NFS stuff needs to be pulled out of `docker-compose.yml` and stuck into a `docker-compose.override.yml` file

#### Windows Config

Haven't tested, but should be quite straight forward. Launch Docker, create a slightly different config, run `docker compose`.

---

Run `./scripts/dev.sh`. This will:

- Build the docker image if necessary
- Run the docker container
- Drop you into a console in the container

### voice

run `voice help` from within the container
