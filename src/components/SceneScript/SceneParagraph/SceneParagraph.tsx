import React from "react";
import HighlightedTextWithArray, { SearchTerm } from "../../Shared/HighlightedTextWithArray/HighlightedTextWithArray";

enum ParagraphTypeEnum {
  Action = 'Action',
  Character = 'Character',
  Parenthetical = 'Parenthetical',
  Dialogue = 'Dialogue',
  Transition = 'Transition',
  EndOfAct = 'End of Act',
  General = 'General',
  Shot = 'Shot',
  Lyrics = 'Lyrics',
  NewAct = 'New Act',
  OutlineBody = 'Outline Body',
  OutlineT = 'Outline T',
  NewEndOfAct = 'New/End of Act',
  Outline3 = 'Outline3',
  ScriptTitle = 'Script Title'
}


interface SceneParagraphProps {
  type: string;
  content: string;
  searchTermsArray?: SearchTerm[];
  paragraphsLoading: boolean;
}

const SceneParagraph: React.FC<SceneParagraphProps> = ({
  type,
  content,
  searchTermsArray,
  paragraphsLoading
}) => {
  let className = '';
  switch (type) {
    case ParagraphTypeEnum.Action:
      className = 'action-paragraph';
      break;
    case ParagraphTypeEnum.Character:
      className = 'character-paragraph';
      break;
    case ParagraphTypeEnum.Parenthetical:
      className = 'parenthetical-paragraph';
      break;
    case ParagraphTypeEnum.Dialogue:
      className = 'dialog-paragraph';
      break;
    case ParagraphTypeEnum.Transition:
      className = 'transition-paragraph';
      break;
    case ParagraphTypeEnum.EndOfAct:
      className = 'end-of-act-paragraph';
      break;
    case ParagraphTypeEnum.General:
      className = 'general-paragraph';
      break;
    case ParagraphTypeEnum.Shot:
      className = 'shot-paragraph';
      break;
    case ParagraphTypeEnum.Lyrics:
      className = 'lyrics-paragraph';
      break;
    case ParagraphTypeEnum.NewAct:
      className = 'new-act-paragraph';
      break;
    case ParagraphTypeEnum.OutlineBody:
      className = 'outline-body-paragraph';
      break;
    case ParagraphTypeEnum.OutlineT:
      className = 'outline-t-paragraph';
      break;
    case ParagraphTypeEnum.NewEndOfAct:
      className = 'new-end-of-act-paragraph';
      break;
    case ParagraphTypeEnum.Outline3:
      className = 'outline3-paragraph';
      break;
    case ParagraphTypeEnum.ScriptTitle:
      className = 'script-title-paragraph';
      break;
    default:
      className = 'default-paragraph';
  }

  return (
    <>
      <p className={`${className} script-paragraph`}>
        {
          searchTermsArray && 
          !paragraphsLoading &&
          (
            <HighlightedTextWithArray text={content} searchTerms={searchTermsArray} />
          )
        }
      </p>
    </>
  );
};

export default SceneParagraph;

// ADD SITE, EXISTENT SCENE