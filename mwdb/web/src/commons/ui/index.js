import React from "react";

export { default as APIKeyList } from "./APIKeyList";
export { default as Autocomplete } from "./Autocomplete";
export { default as BootstrapSelect } from "./BootstrapSelect";
export { default as ConfirmationModal } from "./ConfirmationModal";
export { default as DataTable } from "./DataTable";
export { default as DateString } from "./DateString";
export { default as EditableItem } from "./EditableItem";
export {
    default as ErrorBoundary,
    Alert,
    getErrorMessage,
} from "./ErrorBoundary";
export { default as FeatureSwitch } from "./FeatureSwitch";
export { default as GroupBadge, UserBadge } from "./GroupBadge";
export { default as Hash } from "./Hash";
export { default as HexView } from "./HexView";
export { default as Identicon } from "./Identicon";
export { default as MemberList } from "./MemberList";
export { default as NavDropdown } from "./NavDropdown";
export { default as ObjectLink } from "./ObjectLink";
export { default as PagedList } from "./PagedList";
export { ProtectedRoute, AdministrativeRoute } from "./ProtectedRoute";
export { default as RefString } from "./RefString";
export { default as SortedList } from "./SortedList";
export { default as View, useViewAlert } from "./View";
export { default as ActionCopyToClipboard } from "./ActionCopyToClipboard";

export { Tag, TagList } from "./Tag";
export {
    TabContext,
    useTabContext,
    ObjectTab,
    ObjectAction,
} from "./ObjectTab";

export function getStyleForTag(tag) {
    let styleList = {
        primary: ["spam", "src:", "uploader:", "feed:"],
        warning: ["ripped:", "contains:", "matches:", "maybe:"],
        success: ["static:", "dynamic:"],
        secondary: [
            "runnable:",
            "archive:",
            "dump:",
            "script:",
            "document:",
            "archive",
            "dump",
        ],
    };

    for (let style of Object.keys(styleList)) {
        if (
            styleList[style].filter((t) =>
                t.endsWith(":") ? tag.startsWith(t) : tag === t
            ).length > 0
        )
            return style;
    }
    if (tag.indexOf(":") !== -1) return "info";
    return "danger";
}

export function ShowIf({ condition, children }) {
    return condition ? children : [];
}

export function LimitTo({ children, count }) {
    const more =
        children.length > count
            ? [
                  <small className="text-muted">
                      {" "}
                      and {children.length - 5} more
                  </small>,
              ]
            : [];
    return [...children.slice(0, count), ...more];
}

export function HighlightText(props) {
    let text = React.Children.toArray(props.children)[0].toString();

    if (!props.filterValue) return text;

    let filteredText = props.caseSensitive ? text : text.toLowerCase();
    let filterValue = props.caseSensitive
        ? props.filterValue
        : props.filterValue.toLowerCase();
    let elements = [];

    for (
        var prevIndex = 0, index = filteredText.indexOf(filterValue);
        index >= 0;
        prevIndex = index + filterValue.length,
            index = filteredText.indexOf(
                filterValue,
                index + filterValue.length
            )
    ) {
        elements = elements.concat([
            text.slice(prevIndex, index),
            <span style={{ backgroundColor: "yellow" }}>
                {text.slice(index, index + filterValue.length)}
            </span>,
        ]);
    }
    elements.push(text.slice(prevIndex));
    return elements;
}
