
class ActionCompiler {
    constructor(action, compilerTags) {
        if (compilerTags) {
            this.TAGMAPS = compilerTags;
        } else {
            console.warn("Take care! You don't specify any compiler tags. $STORY, $EDGE, $NODE...")
        }
        this.actionString = action.toString();
        this.actionCode = null;
        this.compiledAction = null;
        console.log('ActionCompiler new ', this.actionString);
    }

    GetActionCode() {
        if (this.actionString.indexOf("${") === 0) {
            this.actionCode = this.actionString.substring(2, this.actionString.length - 1);
            return true;
        } else {
            return false;
        }
    }

    CompileActionCode() {
        if (this.actionCode) {
            // Replace all tags in code
            console.log("Replacing tags...");
            for (let tagKey in this.TAGMAPS) {
                this.actionCode = this.actionCode.split(tagKey).join(this.TAGMAPS[tagKey]);
            }
            console.log(this.actionCode);

            // Return compiled action
            this.compiledAction = this.actionCode.substring(1, this.actionCode.length-1);
        } else {
            console.error("No code to compile: ", + this.actionCode);
            return false;
        }
    }

    static CompileVariables(variables_string, tagmaps) {
        for (let tagKey in tagmaps) {
            variables_string = variables_string.split(tagKey).join(tagmaps[tagKey]);
        }
        return variables_string;
    }

    static EvalVariables(text) {
        console.log('Evaluting variables: ', text);
        return eval('`' + text + '`');
    }

    static RunAction(action) {
        if (action) {
            console.info('Starting action...', action);
            return eval(action);
        }
        else {
            console.error("No action to start!");
            return false;
        }
    }

    static GetActionFromContent(content) {
        let actionReg = /(\$\{\{)(.+?)(\}\})/gm;
        let actions = content.match(actionReg);
        let clearMessage = content.replace(actionReg, "");
        return {
            message: clearMessage.trim(),
            actions: actions
        };
    }
}

ActionCompiler.TAGMAPS = {
    "$STORY": 'storyd'
};