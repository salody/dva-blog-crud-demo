import React, {PropTypes} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import styles from './PostList.css';
import {Table, Card, Button, Icon} from 'antd';
import PostPanel from '../../components/PostPanel/PostPanel';
import moment from 'moment';

const {Column} = Table;

function PostList({
    dispatch,
    postsList,
    paging,
    loading
}) {
    const columnProps = {
        title: 'posts',
        key: 'posts',
        render: (text, record) => {
            const {
                post_id,
                descendants,
                author,
                created_at,
                title,
                visible
            } = record;

            return (
                <Card>
                    <div className={styles.panelContainer}>
                        <PostPanel
                            visible={visible}
                            isSuper={author.ability === 'super'}
                            onEdit={() => console.log('click Edit')}
                            onDelete={() => dispatch({
                                type: 'posts/deletePost', payload: {
                                    post_id, paging: {limit: paging.per_page, page: paging.page}
                                }
                            })}
                            onChangeVisibility={checked => console.log(checked)}
                        />
                    </div>
                    <div className={styles.cardContent}>
                        <span className={styles.commentNumber}>
                            <Link to={`/posts/${post_id}`}>
                                {descendants.length}
                                </Link>
                        </span>
                        <span>
                            <Link to={`/posts/${post_id}`}>
                            <h3>{title}</h3>
                            <p>By <em>{author.username}</em> | {moment(created_at).fromNow()}</p>
                            </Link>
                        </span>
                    </div>
                </Card>
            );
        }
    };

    const pagination = {
        total: paging.total,
        pageSize: paging.per_page,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10'],
        showQuickJumper: true,
        onChange: nextPage => {
            dispatch({
                type: 'posts/fetchPostsList',
                payload: {
                    pageInfo: {
                        limit: paging.per_page,
                        page: nextPage
                    }
                }
            });
        },
        onShowSizeChange: (current, size) => {
            dispatch({
                type: 'posts/fetchPostsList',
                payload: {
                    pageInfo: {
                        limit: size,
                        page: current
                    }
                }
            });
        }
    };

    const tableProps = {
        dataSource: postsList,
        showHeader: false,
        rowKey: 'post_id',
        pagination,
        loading,
        title: () => <div>
            <Link to="/editor?type=creator">
                <Button type="primary" size="large" icon="addfile" className={styles.addPost}>Add Post</Button>
            </Link>
            <h1><Icon type="file-text" className={styles.icon}/>Posts</h1>
        </div>
    };

    return (
        <Table {...tableProps}>
            <Column {...columnProps}/>
        </Table>
    );
}

PostList.propTypes = {
    dispatch: PropTypes.func.isRequired,
    postsList: PropTypes.array.isRequired,
    paging: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        postsList: state.posts.postsList,
        paging: state.posts.paging,
        loading: state.loading.effects['posts/fetchPostsList']
    };
}

export default connect(mapStateToProps)(PostList);
