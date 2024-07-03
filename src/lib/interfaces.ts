export class User {
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  roles: string[] = [];
  photoUrl = "";
  providerId = "";
  status = "";

  constructor(email: string, userName: string, firstName: string, lastName: string) {
    this.email = email;
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

export class UsageData {
  id: string;
  name: string;
  action: string;
  dateTime: string;
  link: string;

  constructor(id: string, name: string, action: string, dateTime: string, link: string) {
    this.id = id;
    this.name = name;
    this.action = action;
    this.dateTime = dateTime;
    this.link = link;
  }
}

export class Config {
  data: DataConfig[] = [];
}

export class DataConfig {
  sheetId: string;
  name: string;
  rangeStart: string;
  rangeEnd: string;
  rowStart: number = 1;
  tagIndexes: {[key: string]: number[]} = {};
  fieldIndexes: {[key: string]: number} = {};
  typeColors: {[key: string]: string} = {};
  typeAbbreviations: {[key: string]: string} = {};
  categoryIcons: {[key: string]: string} = {};
  categoryAbbreviations: {[key: string]: string} = {};
  categoryOrder: string[] = [];
  fields: FieldConfig[] = [];
  relatedFields: string[] = [];
  prompt: string = "";

  constructor(sheetId: string, name: string, rangeStart: string, rangeEnd: string) {
    this.sheetId = sheetId;
    this.name = name;
    this.rangeStart = rangeStart;
    this.rangeEnd = rangeEnd;
  }
}

export class FieldConfig {
  id: string;
  type: string = "string";
  autofocus: boolean = false;
  tags: string[] = [];
  visability: string;
  initialValue: string;
  relatedKey: string = "";
  values: string[];

  constructor(id: string, type: string, visability: string, initialValue: string, values: string[]) {
    this.id = id;
    this.type = type;
    this.visability = visability;
    this.initialValue = initialValue;
    this.values = values;
  }
}

export class RowConfig {
  id: string = "";
  name: string = "";
  description: string = "";
  date: string = "";
  audience: string = "";
  links: string[] = [];
  likes: string[] = [];
  categories: string[] = [];
  types: string[] = [];
  levels: string[] = [];

  tags: {[key: string]: string} = {};
  row: string[] = [];
}