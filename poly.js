class Circle {
    constructor(notes) {
        this.notes = notes;
    }
    start() {
        console.log("Starting with " + this.notes + " notes...")
    }
}


const circ = new Circle(8)

circ.start()
