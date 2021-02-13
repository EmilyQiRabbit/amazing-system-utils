import React from 'react';

export const PATTERNS = {
    url: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*[-a-zA-Z0-9@:%_\+~#?&\/=])*/i,
    phone: /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}/,
    email: /\S+@\S+\.\S+/
};

type RenderText = (text: string, matches: RegExpExecArray) => React.ReactNode;

export interface Pattern {
    pattern: RegExp;
    renderText?: RenderText;
}

class TextExtraction {
    private text: string;
    private patterns: Pattern[];
    constructor(text: string, patterns: Pattern[]) {
        this.text = text;
        this.patterns = patterns || [];
    }

    /**
     * Returns parts of the text with their own props
     * @return {Object[]} - props for all the parts of the text
     */
    parse() {
        let parsedTexts = [{children: this.text, _matched: false}];
        // pattern 的遍历
        this.patterns.forEach(pattern => {
            let newParts = [];
            parsedTexts.forEach(parsedText => {
                // Only allow for now one parsing
                if (parsedText._matched) {
                    newParts.push(parsedText);

                    return;
                }

                let parts = [];
                let textLeft = parsedText.children;
                let indexOfMatchedString = 0;

                while (textLeft) {
                    pattern.pattern.lastIndex = 0;
                    let matches = pattern.pattern.exec(textLeft);

                    if (!matches) {
                        break;
                    }

                    let previousText = textLeft.substr(0, matches.index);
                    indexOfMatchedString += matches.index;

                    parts.push({children: previousText});

                    parts.push(this.getMatchedPart(pattern, matches[0], matches, indexOfMatchedString));

                    textLeft = textLeft.substr(matches.index + matches[0].length);
                    indexOfMatchedString += matches[0].length;
                }

                parts.push({children: textLeft});

                newParts.push(...parts);
            });

            parsedTexts = newParts;
        });

        // Remove _matched key.
        parsedTexts.forEach(parsedText => delete parsedText._matched);

        return parsedTexts.filter(t => !!t.children);
    }

    /**
     * @param pattern - pattern configuration of the pattern used to match the text
     * @param pattern.pattern - pattern used to match the text
     * @param text - Text matching the pattern
     * @param matches - Result of the RegExp.exec
     * @param index - Index of the matched string in the whole string
     * @return props for the matched text
     */
    getMatchedPart(pattern: Pattern, text: string, matches: RegExpExecArray, _index: number) {
        let children = text as React.ReactNode;
        if (typeof pattern.renderText === 'function') {
            children = pattern.renderText(text, matches);
        }

        return {
            children,
            _matched: true
        };
    }
}

export interface ParsedTextProps {
    parse: {type?: 'url', pattern?: RegExp, renderText?: RenderText}[];
    className?: string;
}

class ParsedText extends React.Component<ParsedTextProps> {
    static displayName = 'ParsedText';

    getPatterns() {
        return this.props.parse.map(option => {
            const {type, ...patternOption} = option;
            if (type) {
                if (!PATTERNS[type]) {
                    throw new Error(`${option.type} is not a supported type`);
                }
                patternOption.pattern = PATTERNS[type];
            }

            return patternOption as {pattern: RegExp};
        });
    }

    getParsedText() {
        const {className, parse, children} = this.props;
        if (!parse) {
            return children;
        }
        if (typeof children !== 'string') {
            return children;
        }

        const textExtraction = new TextExtraction(children, this.getPatterns());

        return textExtraction.parse().map((props, index) => {
            // 直接返回 props.children，不需要增加额外的 dom 结构
            return props.children;
        });
    }

    render() {
        return this.getParsedText();
    }
}

export default ParsedText;
