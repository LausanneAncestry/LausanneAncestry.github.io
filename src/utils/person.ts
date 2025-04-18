function capitalizeFirstLetterOfEachWord(str: string): string {
	return str.split(' ').map(word => {
		return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
	}).join(' ').split('-').map(word => {
		return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
	}).join('-');
}

function snakeToCamelCase(str: string): string {
	return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
			  .replace(/^([A-Z])/, (match, letter) => letter.toLowerCase());
  }
  

function transformToPascalCase<T>(obj: Record<string, any>): T {
	const result: Record<string, any> = {};
	Object.keys(obj).forEach(key => {
		const pascalKey = snakeToCamelCase(key);
		result[pascalKey] = obj[key];
	});
	return result as T;
}

export type CensusEntry = {
	id: number,
	censusYear: number,
	censusRow: number,
	firstName: string,
	lastName: string,
	birthYear: string | null,
	origin: string | null,
	job: string | null,
	houseNb: number,
	streetName: string,
	parentCensusEntry: number | null,
	person: number
}

export class Person {
	readonly id: string;
	readonly firstName: string;
	readonly lastName: string;
	readonly birthYear?: number;
	readonly parentId?: number;
	private _parent?: Person;
	readonly censusEntries: readonly CensusEntry[];
	readonly children: Person[];

	constructor(id: string, firstName: string, lastName: string, birthYear: number | undefined, parentId: number, censusEntries: readonly CensusEntry[],) {
		this.id = id;
		this.firstName = capitalizeFirstLetterOfEachWord(firstName);
		this.lastName = capitalizeFirstLetterOfEachWord(lastName);
		this.birthYear = birthYear;
		this.parentId = parentId;
		this.censusEntries = censusEntries;
		this.children = [];
	}

	get name(): string {
		return `${this.firstName} ${this.lastName}`
	}

	// Getter for parent
	get parent(): Person | undefined {
		return this._parent;
	}

	// Setter for parent
	set parent(newParent: Person) {
		if (this._parent) throw new Error("Parent already set")
		this._parent = newParent;
	}

	get censusYears(): number[] {
		return this.censusEntries.map(entry => entry.censusYear)
	}

	get rawNames():  { [key: string]: string } {
		const rawData: { [key: string]: string } = {}
		this.censusEntries.forEach(entry => rawData[entry.censusYear] = `${entry.firstName} ${entry.lastName}`)
		return rawData
	}

	get rawBirthYears(): { [key: string]: string | null } {
		const rawData: { [key: string]: string | null } = {}
		this.censusEntries.forEach(entry => rawData[entry.censusYear] = entry.birthYear)
		return rawData
	}

	get birthYears(): string[] {
		const nonNullData = Object.values(this.rawBirthYears).filter(origin => origin !== null)
		return [...new Set(nonNullData)]
	}

	get rawOrigins(): { [key: string]: string | null } {
		const rawData: { [key: string]: string | null } = {}
		this.censusEntries.forEach(entry => rawData[entry.censusYear] = entry.origin)
		return rawData
	}

	get origins(): string[] {
		const nonNullOData = Object.values(this.rawOrigins).filter(origin => origin !== null)
		return [...new Set(nonNullOData)]
	}

	get rawJobs(): { [key: string]: string | null } {
		const rawData: { [key: string]: string | null } = {}
		this.censusEntries.forEach(entry => rawData[entry.censusYear] = entry.job)
		return rawData
	}

	get jobs(): string[] {
		const nonNullOData = Object.values(this.rawJobs).filter(origin => origin !== null)
		return [...new Set(nonNullOData)]
	}


	static fromJson(json: any): Person {
		const { id, firstName, lastName, censusEntries, parent } = transformToPascalCase(json) as any;

		const birthYear = 3000;

		// Convert censusEntries to CensusEntry[] if needed
		const censusEntriesMapped: CensusEntry[] = censusEntries.map((entry: any) => transformToPascalCase<CensusEntry>(entry));
		censusEntriesMapped.forEach(entry => {
			if (entry.origin) entry.origin = capitalizeFirstLetterOfEachWord(entry.origin)
		})

		// Create a new Person instance
		const person = new Person(
			id, firstName, lastName, birthYear, parent, censusEntriesMapped
		);

		return person;
	}
}

export async function fetchJsonData(url: string = "/tracked.json"): Promise<any> {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error('Network response was not ok ' + response.statusText);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		throw error;
	}
}

export type PersonMap = { [key: string]: Person }
export async function loadPersons(): Promise<PersonMap> {
	return fetchJsonData()
		.then(jsonData => {
			const people: Person[] = jsonData.map((data: any) => Person.fromJson(data));
			const peopleMap: PersonMap = people.reduce((acc: PersonMap, person) => {
				acc[person.id] = person;
				return acc;
			  }, {});

			people.forEach(person => {
				if (person.parentId) {
					person.parent = peopleMap[person.parentId]
					peopleMap[person.parentId].children.push(person)
				}
			})
						
			return peopleMap
		})
		.catch(err => {
			console.error("Error while fetching data:", err)
			return {}
		})
}