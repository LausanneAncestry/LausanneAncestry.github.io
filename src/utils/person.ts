function capitalizeFirstLetterOfEachWord(str: string): string {
    return str.split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

export class Person {
	readonly id: string;
	readonly first_name: string;
	readonly last_name: string;
	readonly job: string;
	private _parent?: Person;
	readonly children: Person[];

	constructor(id: string, first_name: string, last_name: string, job: string, parent?: Person) {
		this.id = id;
		this.first_name = capitalizeFirstLetterOfEachWord(first_name);
		this.last_name = capitalizeFirstLetterOfEachWord(last_name);
		this.job = job;
		this._parent = parent;
		this.children = [];
	}

	// Getter for parent
	get parent(): Person | undefined {
		return this._parent;
	}

	// Setter for parent
	set parent(newParent: Person) {
		this._parent = newParent;
	}
}
