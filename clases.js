class Vehiculo {
    constructor(id, modelo, anoFab, velMax) {
        if (id <= 0) throw new Error('El id debe ser mayor a 0');
        if (!modelo) throw new Error('El modelo no puede estar vacío');
        if (anoFab <= 1885) throw new Error('El año de fabricación debe ser mayor a 1885');
        if (velMax <= 0) throw new Error('La velocidad máxima debe ser mayor a 0');

        this.id = id;
        this.modelo = modelo;
        this.anoFab = anoFab;
        this.velMax = velMax;
    }

    toString() {
        return `ID: ${this.id}, Modelo: ${this.modelo}, Año de Fabricación: ${this.anoFab}, Velocidad Máxima: ${this.velMax}`;
    }
}

class Aereo extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, altMax, autonomia) {
        super(id, modelo, anoFab, velMax);

        if (altMax <= 0) throw new Error('La altitud máxima debe ser mayor a 0');
        if (autonomia <= 0) throw new Error('La autonomía debe ser mayor a 0');

        this.altMax = altMax;
        this.autonomia = autonomia;
    }

    toString() {
        return super.toString() + `, Altitud Máxima: ${this.altMax}, Autonomía: ${this.autonomia}`;
    }
}
class Terrestre extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, cantPue, cantRue) {
        super(id, modelo, anoFab, velMax);

        if (cantPue < -1) throw new Error('La cantidad de puertas debe ser mayor a -1');
        if (cantRue <= 0) throw new Error('La cantidad de ruedas debe ser mayor a 0');

        this.cantPue = cantPue;
        this.cantRue = cantRue;
    }

    toString() {
        return super.toString() + `, Cantidad de Puertas: ${this.cantPue}, Cantidad de Ruedas: ${this.cantRue}`;
    }
}

let vehiculos = [
    new Terrestre(14, "Ferrari F100", 1998, 400, 2, 4),
    new Terrestre(51, "Dodge Viper", 1991, 266, 2, 4),
    new Aereo(67, "Boeing CH-47 Chinook", 1962, 302, 6, 1200),
    new Terrestre(666, "Aprilia RSV 1000 R", 2004, 280, 0, 2),
    new Aereo(872, "Boeing 747-400", 1989, 988, 13, 13450),
    new Aereo(742, "Cessna CH-1 SkyhookR", 1953, 174, 3, 870)
];

for (let vehiculo of vehiculos) {
    console.log(vehiculo.toString());
}