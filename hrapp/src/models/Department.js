class Department {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.manager = data.manager || '';
    this.description = data.description || '';
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      manager: this.manager,
      description: this.description
    };
  }
}

export default Department;
