/**
 * The European Commission's standard contractual clauses between controllers and processors, Commission Implementing
 * Decision (EU) 2021/915 of 4 June 2021, Annex, Sections I to III, word for word (29-10-2026). Source: the Publications
 * Office's XHTML of CELEX 32021D0915 (publications.europa.eu/resource/celex/32021D0915), converted by the generator kept
 * with the plan (Public/docs/plans/29-10-2026-dpa-and-ccpa-terms-plan.md, scratch scripts parse_scc.py).
 *
 * Only the choices the template leaves open are made, as Clause 2(a) allows: every OPTION resolves to Regulation (EU)
 * 2016/679 (the GDPR); Clause 7.7(a) is Option 2 (general written authorisation) with a 30-day notice period; the
 * optional Clause 5 (docking) is not used. Text the template does not mark as a choice is unchanged, "and/or Regulation
 * (EU) 2018/1725" included. Non-breaking spaces are the official typesetting's. Do not edit by hand: a change to these
 * Clauses is a change Clause 2(a) forbids.
 */

export type ScItem = { label: string; text: string }
export type ScPoint = { kind: 'p'; label?: string; text: string; items?: ScItem[]; after?: string }
export type ScSub = { kind: 'sub'; number: string; title: string; blocks: ScPoint[] }
export type ScClause = { number: string; title: string; optional: boolean; notUsed?: boolean; blocks: (ScPoint | ScSub)[] }
export type ScSection = { number: 'I' | 'II' | 'III'; title: string | null; clauses: ScClause[] }

export const STANDARD_CLAUSES: ScSection[] = [
  {
    "number": "I",
    "title": null,
    "clauses": [
      {
        "number": "1",
        "title": "Purpose and scope",
        "optional": false,
        "blocks": [
          {
            "kind": "p",
            "label": "a",
            "text": "The purpose of these Standard Contractual Clauses (the Clauses) is to ensure compliance with Article 28(3) and (4) of Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 on the protection of natural persons with regard to the processing of personal data and on the free movement of such data, and repealing Directive 95/46/EC (General Data Protection Regulation)."
          },
          {
            "kind": "p",
            "label": "b",
            "text": "The controllers and processors listed in Annex I have agreed to these Clauses in order to ensure compliance with Article 28(3) and (4) of Regulation (EU) 2016/679 and/or Article 29(3) and (4) of Regulation (EU) 2018/1725."
          },
          {
            "kind": "p",
            "label": "c",
            "text": "These Clauses apply to the processing of personal data as specified in Annex II."
          },
          {
            "kind": "p",
            "label": "d",
            "text": "Annexes I to IV are an integral part of the Clauses."
          },
          {
            "kind": "p",
            "label": "e",
            "text": "These Clauses are without prejudice to obligations to which the controller is subject by virtue of Regulation (EU) 2016/679 and/or Regulation (EU) 2018/1725."
          },
          {
            "kind": "p",
            "label": "f",
            "text": "These Clauses do not by themselves ensure compliance with obligations related to international transfers in accordance with Chapter V of Regulation (EU) 2016/679 and/or Regulation (EU) 2018/1725."
          }
        ]
      },
      {
        "number": "2",
        "title": "Invariability of the Clauses",
        "optional": false,
        "blocks": [
          {
            "kind": "p",
            "label": "a",
            "text": "The Parties undertake not to modify the Clauses, except for adding information to the Annexes or updating information in them."
          },
          {
            "kind": "p",
            "label": "b",
            "text": "This does not prevent the Parties from including the standard contractual clauses laid down in these Clauses in a broader contract, or from adding other clauses or additional safeguards provided that they do not directly or indirectly contradict the Clauses or detract from the fundamental rights or freedoms of data subjects."
          }
        ]
      },
      {
        "number": "3",
        "title": "Interpretation",
        "optional": false,
        "blocks": [
          {
            "kind": "p",
            "label": "a",
            "text": "Where these Clauses use the terms defined in Regulation (EU) 2016/679 or Regulation (EU) 2018/1725 respectively, those terms shall have the same meaning as in that Regulation."
          },
          {
            "kind": "p",
            "label": "b",
            "text": "These Clauses shall be read and interpreted in the light of the provisions of Regulation (EU) 2016/679 or Regulation (EU) 2018/1725 respectively."
          },
          {
            "kind": "p",
            "label": "c",
            "text": "These Clauses shall not be interpreted in a way that runs counter to the rights and obligations provided for in Regulation (EU) 2016/679 / Regulation (EU) 2018/1725 or in a way that prejudices the fundamental rights or freedoms of the data subjects."
          }
        ]
      },
      {
        "number": "4",
        "title": "Hierarchy",
        "optional": false,
        "blocks": [
          {
            "kind": "p",
            "text": "In the event of a contradiction between these Clauses and the provisions of related agreements between the Parties existing at the time when these Clauses are agreed or entered into thereafter, these Clauses shall prevail."
          }
        ]
      },
      {
        "number": "5",
        "title": "Docking clause",
        "optional": true,
        "blocks": [],
        "notUsed": true
      }
    ]
  },
  {
    "number": "II",
    "title": "OBLIGATIONS OF THE PARTIES",
    "clauses": [
      {
        "number": "6",
        "title": "Description of processing(s)",
        "optional": false,
        "blocks": [
          {
            "kind": "p",
            "text": "The details of the processing operations, in particular the categories of personal data and the purposes of processing for which the personal data is processed on behalf of the controller, are specified in Annex II."
          }
        ]
      },
      {
        "number": "7",
        "title": "Obligations of the Parties",
        "optional": false,
        "blocks": [
          {
            "kind": "sub",
            "number": "7.1",
            "title": "Instructions",
            "blocks": [
              {
                "kind": "p",
                "label": "a",
                "text": "The processor shall process personal data only on documented instructions from the controller, unless required to do so by Union or Member State law to which the processor is subject. In this case, the processor shall inform the controller of that legal requirement before processing, unless the law prohibits this on important grounds of public interest. Subsequent instructions may also be given by the controller throughout the duration of the processing of personal data. These instructions shall always be documented."
              },
              {
                "kind": "p",
                "label": "b",
                "text": "The processor shall immediately inform the controller if, in the processor’s opinion, instructions given by the controller infringe Regulation (EU) 2016/679 / Regulation (EU) 2018/1725 or the applicable Union or Member State data protection provisions."
              }
            ]
          },
          {
            "kind": "sub",
            "number": "7.2",
            "title": "Purpose limitation",
            "blocks": [
              {
                "kind": "p",
                "text": "The processor shall process the personal data only for the specific purpose(s) of the processing, as set out in Annex II, unless it receives further instructions from the controller."
              }
            ]
          },
          {
            "kind": "sub",
            "number": "7.3",
            "title": "Duration of the processing of personal data",
            "blocks": [
              {
                "kind": "p",
                "text": "Processing by the processor shall only take place for the duration specified in Annex II."
              }
            ]
          },
          {
            "kind": "sub",
            "number": "7.4",
            "title": "Security of processing",
            "blocks": [
              {
                "kind": "p",
                "label": "a",
                "text": "The processor shall at least implement the technical and organisational measures specified in Annex III to ensure the security of the personal data. This includes protecting the data against a breach of security leading to accidental or unlawful destruction, loss, alteration, unauthorised disclosure or access to the data (personal data breach). In assessing the appropriate level of security, the Parties shall take due account of the state of the art, the costs of implementation, the nature, scope, context and purposes of processing and the risks involved for the data subjects."
              },
              {
                "kind": "p",
                "label": "b",
                "text": "The processor shall grant access to the personal data undergoing processing to members of its personnel only to the extent strictly necessary for implementing, managing and monitoring of the contract. The processor shall ensure that persons authorised to process the personal data received have committed themselves to confidentiality or are under an appropriate statutory obligation of confidentiality."
              }
            ]
          },
          {
            "kind": "sub",
            "number": "7.5",
            "title": "Sensitive data",
            "blocks": [
              {
                "kind": "p",
                "text": "If the processing involves personal data revealing racial or ethnic origin, political opinions, religious or philosophical beliefs, or trade union membership, genetic data or biometric data for the purpose of uniquely identifying a natural person, data concerning health or a person’s sex life or sexual orientation, or data relating to criminal convictions and offences (“sensitive data”), the processor shall apply specific restrictions and/or additional safeguards."
              }
            ]
          },
          {
            "kind": "sub",
            "number": "7.6",
            "title": "Documentation and compliance",
            "blocks": [
              {
                "kind": "p",
                "label": "a",
                "text": "The Parties shall be able to demonstrate compliance with these Clauses."
              },
              {
                "kind": "p",
                "label": "b",
                "text": "The processor shall deal promptly and adequately with inquiries from the controller about the processing of data in accordance with these Clauses."
              },
              {
                "kind": "p",
                "label": "c",
                "text": "The processor shall make available to the controller all information necessary to demonstrate compliance with the obligations that are set out in these Clauses and stem directly from Regulation (EU) 2016/679 and/or Regulation (EU) 2018/1725. At the controller’s request, the processor shall also permit and contribute to audits of the processing activities covered by these Clauses, at reasonable intervals or if there are indications of non-compliance. In deciding on a review or an audit, the controller may take into account relevant certifications held by the processor."
              },
              {
                "kind": "p",
                "label": "d",
                "text": "The controller may choose to conduct the audit by itself or mandate an independent auditor. Audits may also include inspections at the premises or physical facilities of the processor and shall, where appropriate, be carried out with reasonable notice."
              },
              {
                "kind": "p",
                "label": "e",
                "text": "The Parties shall make the information referred to in this Clause, including the results of any audits, available to the competent supervisory authority/ies on request."
              }
            ]
          },
          {
            "kind": "sub",
            "number": "7.7",
            "title": "Use of sub-processors",
            "blocks": [
              {
                "kind": "p",
                "label": "a",
                "text": "The processor has the controller’s general authorisation for the engagement of sub-processors from an agreed list. The processor shall specifically inform in writing the controller of any intended changes of that list through the addition or replacement of sub-processors at least 30 days in advance, thereby giving the controller sufficient time to be able to object to such changes prior to the engagement of the concerned sub-processor(s). The processor shall provide the controller with the information necessary to enable the controller to exercise the right to object."
              },
              {
                "kind": "p",
                "label": "b",
                "text": "Where the processor engages a sub-processor for carrying out specific processing activities (on behalf of the controller), it shall do so by way of a contract which imposes on the sub-processor, in substance, the same data protection obligations as the ones imposed on the data processor in accordance with these Clauses. The processor shall ensure that the sub-processor complies with the obligations to which the processor is subject pursuant to these Clauses and to Regulation (EU) 2016/679 and/or Regulation (EU) 2018/1725."
              },
              {
                "kind": "p",
                "label": "c",
                "text": "At the controller’s request, the processor shall provide a copy of such a sub-processor agreement and any subsequent amendments to the controller. To the extent necessary to protect business secret or other confidential information, including personal data, the processor may redact the text of the agreement prior to sharing the copy."
              },
              {
                "kind": "p",
                "label": "d",
                "text": "The processor shall remain fully responsible to the controller for the performance of the sub-processor’s obligations in accordance with its contract with the processor. The processor shall notify the controller of any failure by the sub-processor to fulfil its contractual obligations."
              },
              {
                "kind": "p",
                "label": "e",
                "text": "The processor shall agree a third party beneficiary clause with the sub-processor whereby - in the event the processor has factually disappeared, ceased to exist in law or has become insolvent - the controller shall have the right to terminate the sub-processor contract and to instruct the sub-processor to erase or return the personal data."
              }
            ]
          },
          {
            "kind": "sub",
            "number": "7.8",
            "title": "International transfers",
            "blocks": [
              {
                "kind": "p",
                "label": "a",
                "text": "Any transfer of data to a third country or an international organisation by the processor shall be done only on the basis of documented instructions from the controller or in order to fulfil a specific requirement under Union or Member State law to which the processor is subject and shall take place in compliance with Chapter V of Regulation (EU) 2016/679 or Regulation (EU) 2018/1725."
              },
              {
                "kind": "p",
                "label": "b",
                "text": "The controller agrees that where the processor engages a sub-processor in accordance with Clause 7.7. for carrying out specific processing activities (on behalf of the controller) and those processing activities involve a transfer of personal data within the meaning of Chapter V of Regulation (EU) 2016/679, the processor and the sub-processor can ensure compliance with Chapter V of Regulation (EU) 2016/679 by using standard contractual clauses adopted by the Commission in accordance with of Article 46(2) of Regulation (EU) 2016/679, provided the conditions for the use of those standard contractual clauses are met."
              }
            ]
          }
        ]
      },
      {
        "number": "8",
        "title": "Assistance to the controller",
        "optional": false,
        "blocks": [
          {
            "kind": "p",
            "label": "a",
            "text": "The processor shall promptly notify the controller of any request it has received from the data subject. It shall not respond to the request itself, unless authorised to do so by the controller."
          },
          {
            "kind": "p",
            "label": "b",
            "text": "The processor shall assist the controller in fulfilling its obligations to respond to data subjects’ requests to exercise their rights, taking into account the nature of the processing. In fulfilling its obligations in accordance with (a) and (b), the processor shall comply with the controller’s instructions"
          },
          {
            "kind": "p",
            "label": "c",
            "text": "In addition to the processor’s obligation to assist the controller pursuant to Clause 8(b), the processor shall furthermore assist the controller in ensuring compliance with the following obligations, taking into account the nature of the data processing and the information available to the processor:",
            "items": [
              {
                "label": "1",
                "text": "the obligation to carry out an assessment of the impact of the envisaged processing operations on the protection of personal data (a ‘data protection impact assessment’) where a type of processing is likely to result in a high risk to the rights and freedoms of natural persons;"
              },
              {
                "label": "2",
                "text": "the obligation to consult the competent supervisory authority/ies prior to processing where a data protection impact assessment indicates that the processing would result in a high risk in the absence of measures taken by the controller to mitigate the risk;"
              },
              {
                "label": "3",
                "text": "the obligation to ensure that personal data is accurate and up to date, by informing the controller without delay if the processor becomes aware that the personal data it is processing is inaccurate or has become outdated;"
              },
              {
                "label": "4",
                "text": "the obligations in Article 32 of Regulation (EU) 2016/679."
              }
            ]
          },
          {
            "kind": "p",
            "label": "d",
            "text": "The Parties shall set out in Annex III the appropriate technical and organisational measures by which the processor is required to assist the controller in the application of this Clause as well as the scope and the extent of the assistance required."
          }
        ]
      },
      {
        "number": "9",
        "title": "Notification of personal data breach",
        "optional": false,
        "blocks": [
          {
            "kind": "p",
            "text": "In the event of a personal data breach, the processor shall cooperate with and assist the controller for the controller to comply with its obligations under Articles 33 and 34 of Regulation (EU) 2016/679 or under Articles 34 and 35 of Regulation (EU) 2018/1725, where applicable, taking into account the nature of processing and the information available to the processor."
          },
          {
            "kind": "sub",
            "number": "9.1",
            "title": "Data breach concerning data processed by the controller",
            "blocks": [
              {
                "kind": "p",
                "text": "In the event of a personal data breach concerning data processed by the controller, the processor shall assist the controller:"
              },
              {
                "kind": "p",
                "label": "a",
                "text": "in notifying the personal data breach to the competent supervisory authority/ies, without undue delay after the controller has become aware of it, where relevant/(unless the personal data breach is unlikely to result in a risk to the rights and freedoms of natural persons);"
              },
              {
                "kind": "p",
                "label": "b",
                "text": "in obtaining the following information which, pursuant to Article 33(3) of Regulation (EU) 2016/679, shall be stated in the controller’s notification, and must at least include:",
                "items": [
                  {
                    "label": "1",
                    "text": "the nature of the personal data including where possible, the categories and approximate number of data subjects concerned and the categories and approximate number of personal data records concerned;"
                  },
                  {
                    "label": "2",
                    "text": "the likely consequences of the personal data breach;"
                  },
                  {
                    "label": "3",
                    "text": "the measures taken or proposed to be taken by the controller to address the personal data breach, including, where appropriate, measures to mitigate its possible adverse effects."
                  }
                ],
                "after": "Where, and insofar as, it is not possible to provide all this information at the same time, the initial notification shall contain the information then available and further information shall, as it becomes available, subsequently be provided without undue delay."
              },
              {
                "kind": "p",
                "label": "c",
                "text": "in complying, pursuant to Article 34 of Regulation (EU) 2016/679, with the obligation to communicate without undue delay the personal data breach to the data subject, when the personal data breach is likely to result in a high risk to the rights and freedoms of natural persons."
              }
            ]
          },
          {
            "kind": "sub",
            "number": "9.2",
            "title": "Data breach concerning data processed by the processor",
            "blocks": [
              {
                "kind": "p",
                "text": "In the event of a personal data breach concerning data processed by the processor, the processor shall notify the controller without undue delay after the processor having become aware of the breach. Such notification shall contain, at least:"
              },
              {
                "kind": "p",
                "label": "a",
                "text": "a description of the nature of the breach (including, where possible, the categories and approximate number of data subjects and data records concerned);"
              },
              {
                "kind": "p",
                "label": "b",
                "text": "the details of a contact point where more information concerning the personal data breach can be obtained;"
              },
              {
                "kind": "p",
                "label": "c",
                "text": "its likely consequences and the measures taken or proposed to be taken to address the breach, including to mitigate its possible adverse effects."
              },
              {
                "kind": "p",
                "text": "Where, and insofar as, it is not possible to provide all this information at the same time, the initial notification shall contain the information then available and further information shall, as it becomes available, subsequently be provided without undue delay."
              },
              {
                "kind": "p",
                "text": "The Parties shall set out in Annex III all other elements to be provided by the processor when assisting the controller in the compliance with the controller’s obligations under Articles 33 and 34 of Regulation (EU) 2016/679."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "number": "III",
    "title": "FINAL PROVISIONS",
    "clauses": [
      {
        "number": "10",
        "title": "Non-compliance with the Clauses and termination",
        "optional": false,
        "blocks": [
          {
            "kind": "p",
            "label": "a",
            "text": "Without prejudice to any provisions of Regulation (EU) 2016/679 and/or Regulation (EU) 2018/1725, in the event that the processor is in breach of its obligations under these Clauses, the controller may instruct the processor to suspend the processing of personal data until the latter complies with these Clauses or the contract is terminated. The processor shall promptly inform the controller in case it is unable to comply with these Clauses, for whatever reason."
          },
          {
            "kind": "p",
            "label": "b",
            "text": "The controller shall be entitled to terminate the contract insofar as it concerns processing of personal data in accordance with these Clauses if:",
            "items": [
              {
                "label": "1",
                "text": "the processing of personal data by the processor has been suspended by the controller pursuant to point (a) and if compliance with these Clauses is not restored within a reasonable time and in any event within one month following suspension;"
              },
              {
                "label": "2",
                "text": "the processor is in substantial or persistent breach of these Clauses or its obligations under Regulation (EU) 2016/679 and/or Regulation (EU) 2018/1725;"
              },
              {
                "label": "3",
                "text": "the processor fails to comply with a binding decision of a competent court or the competent supervisory authority/ies regarding its obligations pursuant to these Clauses or to Regulation (EU) 2016/679 and/or Regulation (EU) 2018/1725."
              }
            ]
          },
          {
            "kind": "p",
            "label": "c",
            "text": "The processor shall be entitled to terminate the contract insofar as it concerns processing of personal data under these Clauses where, after having informed the controller that its instructions infringe applicable legal requirements in accordance with Clause 7.1 (b), the controller insists on compliance with the instructions."
          },
          {
            "kind": "p",
            "label": "d",
            "text": "Following termination of the contract, the processor shall, at the choice of the controller, delete all personal data processed on behalf of the controller and certify to the controller that it has done so, or, return all the personal data to the controller and delete existing copies unless Union or Member State law requires storage of the personal data. Until the data is deleted or returned, the processor shall continue to ensure compliance with these Clauses."
          }
        ]
      }
    ]
  }
]
