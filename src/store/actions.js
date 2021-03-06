import * as types from './mutation_types'
import { saveWantedMovie, saveWatchedMovie, saveComment, saveCelebrity, saveSearch, deleteSearch, clearSearch } from 'assets/js/cache'

export const markWantedMovie = function({ commit }, movie) {
    commit(types.SET_WANTED_MOVIES, saveWantedMovie(movie));
}
export const markWatchedMovie = function({ commit }, movie) {
    commit(types.SET_WATCHED_MOVIES, saveWatchedMovie(movie));
}
export const markComment = function({ commit }, id) {
    commit(types.SET_FAVORITE_COMMENTS, saveComment(id));
}
export const markCelebrity = function({ commit }, celebrity) {
    commit(types.SET_COLLECT_CELEBRITY, saveCelebrity(celebrity));
}
export const saveSearchHistory = function({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}
export const deleteSearchHistory = function({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}
export const clearSearchHistory = function({ commit }) {
    commit(types.SET_SEARCH_HISTORY, clearSearch())
}