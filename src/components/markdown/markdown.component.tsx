import classNames from "classnames";
import { memo, useMemo, Fragment } from "react";
import ReactMarkdown from "react-markdown";
import { useIsInsideModal } from "../modal/modal";

const RenderMarkdown = memo<{ md: string }>(({ md }) => {
  const isInsideModal = useIsInsideModal();
  return (
    <ReactMarkdown
      children={md}
      className="max-w-[650px]"
      components={{
        h1: props => <h1 className={classNames("mb-3", isInsideModal ? 'type-header' : 'type-callout')} {...props} />,
        h2: props => <h2 className={classNames("mb-3", isInsideModal ? 'type-header' : 'type-callout')} {...props} />,
        h3: props => <h3 className={classNames("mb-3", isInsideModal ? 'type-header' : 'type-callout')} {...props} />,
        p: props => <p className="mb-3 type-body text-material-medium-3" {...props} />,
        ul: props => <ul className="list-disc ml-5 mb-4 type-body" {...props} />,
        ol: props => <ol className="list-decimal ml-5 mb-4 type-body" {...props} />,
        li: props => <li className="mb-2 type-body text-material-medium-3" {...props} />,
        code: props => <code className="type-caption material px-2 py-1 type-tiny font-mono" {...props} />,
        pre: props => <pre className="type-caption bg-gray-100 rounded-lg p-4 overflow-auto mb-4" {...props} />,
        blockquote: props => <blockquote className="type-subheadline border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4" {...props} />,
        hr: () => <></>,
        a: props => <a className="text-blue-500 hover:underline" target="_blank" {...props} />,
      }}
    />
  );
});

export const InlineMarkdownComponent = memo<{ children: string; }>(
  ({ children }) => (
    <RenderMarkdown md={children} />
  ),
);

export const MarkdownPageComponent = memo<{ children: string; className: string; }>(
  ({ children, className }) => {
    const sections = useMemo((): {
      title: string;
      markdown?: string;
      subsections?: { title: string; markdown?: string }[];
    }[] => {
      const sectionStrings = children.split(/^# /gm).filter(Boolean);

      return sectionStrings.map((section) => {
        const [title, ...contentLines] = section.split("\n");
        const content = contentLines.join("\n");
        const [markdown, ...subsectionContent] = content.split(/^## /gm);

        const subsections = subsectionContent.map((subsection) => {
          const [subTitle, ...subContentLines] = subsection.split("\n");
          const subMarkdown = subContentLines.join("\n").trim();
          return {
            title: subTitle.trim(),
            markdown: subMarkdown || undefined,
          };
        });

        const mainMarkdown = markdown.trim();
        return {
          title: title.trim(),
          markdown: mainMarkdown || undefined,
          subsections: subsections.length > 0 ? subsections : undefined,
        };
      });
    }, [children]);
    const isInsideModal = useIsInsideModal();

    return (
      <div className={classNames(className)}>
        <div className="flex flex-col lg:hidden">
          {sections.map((section, i) => (
            <Fragment key={i}>
              <h1 className={classNames("type-top text-center w-full max-w-[800px] mx-auto mb-4", { 'lg:type-display': !isInsideModal })}>
                {section.title}
              </h1>
              {section.markdown && (
                <h1 className="type-header text-material-medium-2 text-center w-full max-w-[650px]">
                  {section.markdown}
                </h1>
              )}
              {section.subsections?.map((subsection, j) => (
                <Fragment key={j}>
                  <hr className="border-t border-material-main-1 my-8" />
                  <h2 className="type-header text-material-medium-2 mb-4 w-full max-w-[650px]">
                    {subsection.title}
                  </h2>
                  <RenderMarkdown md={subsection.markdown ?? ""} />
                </Fragment>
              ))}
            </Fragment>
          ))}
        </div>
        <table className="w-full hidden lg:table">
          <tbody>
            {sections.map((section, i) => (
              <Fragment key={i}>
                <tr>
                  <td colSpan={2}>
                    <h1 className={classNames(" text-center w-full max-w-[800px] mx-auto", isInsideModal ? 'type-top' : 'type-display')}>
                      {section.title}
                    </h1>
                  </td>
                </tr>
                {section.markdown && (
                  <tr>
                    <td colSpan={2}>
                      <h1 className="type-header text-material-medium-2 text-center w-full max-w-[650px] mx-auto">
                        {section.markdown}
                      </h1>
                    </td>
                  </tr>
                )}

                {section.subsections?.map((subsection, j) => (
                  <Fragment key={j}>
                    {isInsideModal ? (
                      <>
                        <tr>
                          {/*  className="mt-4 flex flex-row gap-4 border-t pt-5" */}
                          <td className=" align-top type-header text-material-medium-2" colSpan={2}>
                            <h2 className=" whitespace-nowrap pr-8">
                              {subsection.title}
                            </h2>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2}>
                            <RenderMarkdown md={subsection.markdown ?? ""} />
                          </td>
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr>
                          <td colSpan={2}>
                            <hr className="border-t border-material-main-1 my-16" />
                          </td>
                        </tr>
                        <tr>
                          {/*  className="mt-4 flex flex-row gap-4 border-t pt-5" */}
                          <td className=" align-top type-header text-material-medium-2">
                            <h2 className=" whitespace-nowrap pr-8">
                              {subsection.title}
                            </h2>
                          </td>
                          <td>
                            <RenderMarkdown md={subsection.markdown ?? ""} />
                          </td>
                        </tr>
                      </>
                    )}
                  </Fragment>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
);
