<form method="post" action="index.php">
    <div>
        <label for="initial">
            <input id="initial" type="radio" name="action" value="getInitialInfo" checked>getInitialInfo
        </label>
    </div>

    <div>
        <label for="userWord">
            UserWord: <input id="userWord" type="text" name="userWord" >
        </label>
        <label for="checkWord">
            <input id="checkWord" type="radio" name="action" value="checkWord"> checkWord
        </label>
    </div>

    <div>
        <label for="createRecord">
            CreateRecord: <input id="createRecord" type="text" name="createRecord" >
        </label>
        <label for="actionCreate">
            <input id="actionCreate" type="radio" name="action" value="createRecord"> createRecord
        </label>
    </div>
    <button type="submit">Submit</button>
</form>