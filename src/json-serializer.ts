import {
  Building,
  Component,
  Door,
  FlatRoof,
  NeighbourBuilding,
  Roof,
  Slab,
  Space,
  Surface,
  Wall,
  Zone
} from "./components";

class JsonSerializer {
  public serialize(components: Component[]): string {
    let componentsWithtype = []
    for (let component of components) {

      componentsWithtype.push(
        Object.assign({'type': component.constructor.name }, component)
      )
    }
    return JSON.stringify(componentsWithtype)
  }

  public deserialize(json: string): Component[] {
    const components: Component[] = []
    const objects = JSON.parse(json)
    for (const object of objects) {
      if ('type' ! in object.keys()) {
        throw 'Object is missing key `type`';
      }
      const type = object.type
      delete object['type'];

      if (type === "Surface") {
        components.push(object as Surface)
      }
      if (type === "Wall") {
        components.push(object as Wall)
      }
      if (type === "Slab") {
        components.push(object as Slab)
      }
      if (type === "Door") {
        components.push(object as Door)
      }
      if (type === "Roof") {
        components.push(object as Roof)
      }
      if (type === "FlatRoof") {
        components.push(object as FlatRoof)
      }
      if (type === "NeighbourBuilding") {
        components.push(object as NeighbourBuilding)
      }
      if (type === "Space") {
        components.push(object as Space)
      }
      if (type === "Building") {
        components.push(object as Building)
      }
      if (type === "Zone") {
        components.push(object as Zone)
      }
    }
    return components
  }
}

export default JsonSerializer
