import "./styles.css";

const ICON = `<svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.06667 14.6667V13.6667H8.06667H7.33333C5.65363 13.6667 4.04272 12.9994 2.85499 11.8117C1.66726 10.6239 1 9.01304 1 7.33333C1 5.65363 1.66726 4.04272 2.85499 2.85499C4.04272 1.66726 5.65363 1 7.33333 1H14.6667C16.3464 1 17.9573 1.66726 19.145 2.85499C20.3327 4.04272 21 5.65363 21 7.33333C21 9.01304 20.3327 10.6239 19.145 11.8117C17.9573 12.9994 16.3464 13.6667 14.6667 13.6667H12.4667H12.1046L11.8265 13.8984L9.06667 16.1983V14.6667Z" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" fill="none"/><path d="M7.90623 7.86849C8.22264 7.86849 8.47915 7.61199 8.47915 7.29557C8.47915 6.97916 8.22264 6.72266 7.90623 6.72266C7.58982 6.72266 7.33331 6.97916 7.33331 7.29557C7.33331 7.61199 7.58982 7.86849 7.90623 7.86849Z" fill="currentColor" stroke="currentColor" stroke-miterlimit="10"/><path d="M11.3437 7.86849C11.6601 7.86849 11.9166 7.61199 11.9166 7.29557C11.9166 6.97916 11.6601 6.72266 11.3437 6.72266C11.0273 6.72266 10.7708 6.97916 10.7708 7.29557C10.7708 7.61199 11.0273 7.86849 11.3437 7.86849Z" fill="currentColor" stroke="currentColor" stroke-miterlimit="10"/><path d="M14.7812 7.86849C15.0976 7.86849 15.3541 7.61199 15.3541 7.29557C15.3541 6.97916 15.0976 6.72266 14.7812 6.72266C14.4648 6.72266 14.2083 6.97916 14.2083 7.29557C14.2083 7.61199 14.4648 7.86849 14.7812 7.86849Z" fill="currentColor" stroke="currentColor" stroke-miterlimit="10"/></svg>`;

const DEFAULT_DATA = {
    component: null,
    props: {}
};

class ComponentSelectorTool {
    constructor({ data, config, api }) {
        this.api = api;
        this.config = config;
        if (!config.components || !config.components.length) {
            throw new Error("You must define one component at least")
        }
        this.nodes = {
            container: null,
            //
            selector: null,
            selector_wrapper: null,
            options: [],
        };
        this._data = null;
        this.data = data;
    }

    static get toolbox() {
        return {
            title: "Вставить диалог",
            icon: ICON
        };
    }

    /**
     * Create element with styles
     * @param {string} tag
     * @param {Array<string>} classes
     * @param {Object} attrs
     */
    makeElement(tag, classes, attrs) {
        const element = document.createElement(tag);
        element.classList.add(...classes);
        if (attrs) {
            for (const key in attrs) {
                element.setAttribute(key, attrs[key]);
            }
        }
        return element;
    }

    /**
     * Create class string with tool prefix
     * @param {string} cls
     */
    makeClass(cls) {
        return `component-selector_tool__${cls}`;
    }

    render() {
        this.nodes.container = this.makeElement("div", [
            this.makeClass("container"),
            "cdx-block"
        ]);
        this.nodes.container.appendChild(this.makeSelector());
        return this.nodes.container;
    }

    set data(data) {
        this._data = Object.assign({}, DEFAULT_DATA, data);
    }

    get data() {
        return this._data;
    }

    save() {
        return this.data;
    }

    validate() {
        if (this.data.component) {
            return true;
        }
        return false;
    }

    getComponentByName(name) {
        return this.config.components.find(c => c.name === name);
    }

    changeComponent(selector) {
        const component = this.getComponentByName(selector.value);
        this.data = {
            component: component.name,
            props: component.props || {}
        };
    }

    /**
     * Create selector element + options and setup listeners
     */
    makeSelector() {
        this.nodes.selector_wrapper = this.makeElement("div", [
            this.makeClass("selector_wrapper")
        ]);
        const selector = (this.nodes.selector = this.makeElement("select", [
            this.makeClass("selector")
        ]));
        this.nodes.selector_wrapper.appendChild(selector);
        for (let component of this.config.components) {
            const option = this.makeElement(
                "option",
                [this.makeClass("option")],
                {
                    value: component.name
                }
            );
            option.innerText = component.alias || component.name;
            this.nodes.options.push(option);
            selector.appendChild(option);
        }
        selector.value = this.data.component || this.config.components[0].name;
        selector.addEventListener("change", event =>
            this.changeComponent(event.target)
        );
        this.changeComponent(selector);
        return this.nodes.selector_wrapper;
    }
}

export default ComponentSelectorTool;
