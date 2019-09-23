declare module "uifx" {

    export interface UIfxProps {
        file: any
        config: any
    }
    
    export default class UIfx extends React.Component<UIfxProps> {
      play(): any
    }
}
