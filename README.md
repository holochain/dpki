# DPKI
[![Code Status](https://img.shields.io/badge/Code-Pre--Alpha-orange.svg)](https://github.com/Holochain/dki#feature-roadmap-and-current-progress)
[![In Progress](https://img.shields.io/waffle/label/Holochain/dpk/in%20progress.svg)](http://waffle.io/Holochain/dpki)
[![Gitter](https://badges.gitter.im/metacurrency/holochain.svg)](https://gitter.im/metacurrency/holochain?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0)

**Distributed Public Key Infrastructure on Holochain**

**[Code Status:](https://github.com/metacurrency/holochain/milestones?direction=asc&sort=completeness&state=all)** Pre-alpha. Not for production use. This application has not been audited for any security validation.

The DPKI module provides a few main features:
 1. A set of better key management methods for Holochain users.
    - Revocation key distinct from source chain key, 
    - delegation of a revocation authority, 
    - M of N signing by authorized peers for key revocation.
 2. A pluggable mixin module for any Holochain application to bridge to DPKI for both key management and continuity of identity across multiple Holochain applications
 3. A space to aggregate identity information:
    - Delegation of public-facing identity services to an identity service provider of your choosing.
    - Storage of identity information in PRIVATE entries on your own DPKI chain for selective release via capabilities tokens.
    - Linking of signed claims from third parties authenticating aspects of your identity.
    
We see these base features enabling a massive emergent identity ecosystem built on a foundation of self-managed public/private keys.

More info to come!

## Installation

Prerequiste: [Install holochain](https://github.com/metacurrency/holochain/#installation) on your machine.
You can install dpki very simply with this:

``` shell
hcdev init -cloneExample=dpki

```

## Usage

To do a test run of the dpki app simply type

``` shell
cd dpki
hcdev web
```
you should see something like:

``` shell
Copying chain to: /home/bootstrap/.holochaindev
...
Serving holochain with DNA hash:QmUwUdSwJ16e5mZf2owc7vKWDi1p46qUijkS5hh997Dohj on port:4141
```
Then simply point your browser to http://localhost:4141 access the dpki UI.

### Tests
To run all the stand alone tests:

``` shell
hcdev test
```

## Feature Roadmap and Current Progress

 - [ ] Bring up to date with Alpha0 Holochain release
 - [ ] Security review and code cleanup of existing code-base
 - [ ] Multi-sig via Schnorr sigs instead of composed via holochain sigs?
 - [ ] Oauth bridging to enable people to be their own Oauth provider for outside web applications. :D
 - [ ] Clarify structure of identity claims & interfaces with them
 - [ ] Clarify 3rd-party identity provider protocols.


## Contribute
We welcome pull requests and issue tickets.  Find us on [gitter](https://gitter.im/metacurrency/holochain) to chat.

Contributors to this project are expected to follow our [development protocols & practices](https://github.com/metacurrency/holochain/wiki/Development-Protocols).

## License
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0)

Copyright (C) 2017, The MetaCurrency Project (Eric Harris-Braun, Arthur Brock, et. al.)

This program is free software: you can redistribute it and/or modify it under the terms of the license provided in the LICENSE file (GPLv3).  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

**Note:** We are considering other 'looser' licensing options (like MIT license) but at this stage are using GPL while we're getting the matter sorted out.
