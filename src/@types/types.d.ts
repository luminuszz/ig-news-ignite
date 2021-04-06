declare type RComponent<props = {}> = (props: props) => JSX.Element;

type UnionProps<ServerProps = {}, ClientProps = {}> = ServerProps & ClientProps;
