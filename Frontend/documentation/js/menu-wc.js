'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">New QCM + documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AdminComponent.html" data-type="entity-link" >AdminComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AffichageResultsComponent.html" data-type="entity-link" >AffichageResultsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AjoutQcmComponent.html" data-type="entity-link" >AjoutQcmComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AjoutQcmQuestionComponent.html" data-type="entity-link" >AjoutQcmQuestionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AjoutQuestionComponent.html" data-type="entity-link" >AjoutQuestionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AjoutUtilisateurComponent.html" data-type="entity-link" >AjoutUtilisateurComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChoixQcmComponent.html" data-type="entity-link" >ChoixQcmComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConfirmationModalComponent.html" data-type="entity-link" >ConfirmationModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardAdminComponent.html" data-type="entity-link" >DashboardAdminComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardStagiaireComponent.html" data-type="entity-link" >DashboardStagiaireComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link" >LoginComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ModalComponent.html" data-type="entity-link" >ModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ModificationQcmComponent.html" data-type="entity-link" >ModificationQcmComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ModificationQcmQuestionComponent.html" data-type="entity-link" >ModificationQcmQuestionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ModificationQuestionComponent.html" data-type="entity-link" >ModificationQuestionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ModificationUtilisateurComponent.html" data-type="entity-link" >ModificationUtilisateurComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PaginationComponent.html" data-type="entity-link" >PaginationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SearchBarComponent.html" data-type="entity-link" >SearchBarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StagiaireComponent.html" data-type="entity-link" >StagiaireComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SuppressionQcmComponent.html" data-type="entity-link" >SuppressionQcmComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SuppressionQuestionComponent.html" data-type="entity-link" >SuppressionQuestionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SuppressionUtilisateurComponent.html" data-type="entity-link" >SuppressionUtilisateurComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/QcmService.html" data-type="entity-link" >QcmService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/QuestionService.html" data-type="entity-link" >QuestionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/QuizAttemptsService.html" data-type="entity-link" >QuizAttemptsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StatsService.html" data-type="entity-link" >StatsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AttemptPayload.html" data-type="entity-link" >AttemptPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AttemptQuestion.html" data-type="entity-link" >AttemptQuestion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AttemptResponse.html" data-type="entity-link" >AttemptResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthUser.html" data-type="entity-link" >AuthUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QCM.html" data-type="entity-link" >QCM</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Question.html" data-type="entity-link" >Question</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QuestionResponse.html" data-type="entity-link" >QuestionResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ResponseOption.html" data-type="entity-link" >ResponseOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserAnswer.html" data-type="entity-link" >UserAnswer</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#pipes-links"' :
                                'data-bs-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/TimeFormatPipe.html" data-type="entity-link" >TimeFormatPipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/TruncateEmailPipe.html" data-type="entity-link" >TruncateEmailPipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});