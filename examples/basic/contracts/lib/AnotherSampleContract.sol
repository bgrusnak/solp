// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
#define PI 31415
contract AnotherSampleContract {
    address admin;
    constructor() {
        admin = address(ADMIN);
    }

    function pimul(uint val) public pure returns(uint) {
        return PI + val * PI / 10000;
    }
}
