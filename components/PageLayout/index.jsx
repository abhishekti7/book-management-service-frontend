import "./styles.scss";

const PageLayout = props => {
    return (
        <div className="page__container">
            {props.children}
        </div>
    );
};

export default PageLayout;