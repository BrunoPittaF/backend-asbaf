import "express-session";


//position é o parentesco
// 2 = conjuge 3 = filho (mais velho) 4= filho (segundo mais velho), etc 

interface IRelativesFront {
  cpf: string;
  name: string,
  position: number,
}

interface IRelativesBD extends IRelativesFront {
  numberAssociated: string;
  userCpf: string
}

declare module "express-session" {
  interface SessionData {
    relatives: IRelativesFront[];
    IRelativesBD: IRelativesBD[];
  }
}