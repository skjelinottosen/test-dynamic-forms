export interface Data {
    Gruppe: string;
    GruppeSortering: number;
    Felter: Felter[];
}
  
export interface Felter {
  Feltnavn: string;
  FieldID: number;
  Visible: string;
  Required: string;
}
