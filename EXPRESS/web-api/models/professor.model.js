class ProfessorModel {
    constructor(id, name, department) {
        this.id = id;
        this.name = name;
        this.department = department;
    }
    
    getId() {
        return this.id;
    }
    
    getName() {
        return this.name;
    }
    
    getDepartment() {
        return this.department;
    }
    
    setName(name) {
        this.name = name;
    }
    
    setDepartment(department) {
        this.department = department;
    }
}

// CommonJS
module.exports = ProfessorModel;

// ES6 Module
//export default ProfessorModel;