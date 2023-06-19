class Ship {
    constructor(length) {
        this.shipLength = length;
        this.hitCount = 0;
        this.sunkStatus = false;
    }

    hit() {
        this.hitCount += 1;
    }

    isSunk() {
        if (this.shipLength === this.hitCount) {
            this.sunkStatus = true;
        }
    }
}

export default Ship