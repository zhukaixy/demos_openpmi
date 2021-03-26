## Description
    以CacheServer为例，阐述XXX的在实际项目中的使用场景
## Requirements
* Install an Accelerator on each network your team regularly works on. You must have a machine running on your local network that can host an Accelerator. When selecting a host, consider the following requirements:

** The local host must run one of the following operating systems:
*** Linux (Ubuntu 16.04, Ubuntu 18.04, or CentOS 7)
> For Linux you must install Acccelerator as a root user.
> Windows Server 2008R2 / Windows 7 or higher (64bit)
> Mac OS X 10.12 or higher (64bit)

### Install Docker Engine on Debian
https://docs.docker.com/engine/install/debian/

### Build Images
sudo docker build --tag cacheserver:1.0.0 --build-arg CACHE_SERVER_VERSION=6.4.0 .

### Start server
docker run -d -p 8126:8126 -v $(pwd):/srv/unity/cache --name cacheserver cacheserver:1.0.0
